import './App.css'
import ReactToPrint from 'react-to-print';

import React, { useState,useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}
const preparePieChartData = (schedule: AmortizationEntry[]) => {
  const totalPrincipal = schedule.reduce((sum, entry) => sum + entry.principalPayment, 0);
  const totalInterest = schedule.reduce((sum, entry) => sum + entry.interest, 0);
  return [
    { name: 'Principal', value: totalPrincipal },
    { name: 'Interest', value: totalInterest },
  ];
};

const prepareBarChartData = (schedule: AmortizationEntry[]) => {
  return schedule.map(entry => ({
    month: entry.month,
    principal: entry.principalPayment,
    interest: entry.interest,
  }));
};
const SliderInput: React.FC<SliderInputProps> = ({ label, value, onChange, min, max, step, unit }) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-4">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={min}
          max={max}
          step={step}
          className="flex-grow"
        />
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-21"
          min={min}
          max={max}
          step={step}
        />
        <span className="w-16 text-right">{unit}</span>
      </div>
    </div>
  );
};


interface AmortizationEntry {
    month: number;
    beginningBalance: number;
    interest: number;
    principalPayment: number;
    emi: number;
    endingBalance: number;
  }
const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [loanTerm, setLoanTerm] = useState<number>(180); // Default to 15 years (180 months)
  const [interestRate, setInterestRate] = useState<number>(5);
  const [isYears, setIsYears] = useState<boolean>(true);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationEntry[]>([]);
  const componentRef = useRef<HTMLDivElement>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const loanTermInMonths = isYears ? loanTerm * 12 : loanTerm;
    
    try {
      const response = await fetch(`http://localhost:5118/api/amortizationSchedule?PrincipalAmount=${loanAmount}&LoanTermInMonths=${loanTermInMonths}&interestRate=${interestRate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: AmortizationEntry[] = await response.json();
      setAmortizationSchedule(result);
      console.log('Amortization Schedule:', result);
      console.log('API response:', result);
      
      

    } catch (error) {
      console.error('There was an error calling the API:', error);
      
    }
  };

  const handleLoanTermChange = (value: number) => {
    setLoanTerm(value);
  };

  const toggleYearsMonths = () => {
    if (isYears) {
      setLoanTerm(loanTerm * 12);
    } else {
      setLoanTerm(Math.round(loanTerm / 12));
    }
    setIsYears(!isYears);
  };
  const COLORS = ['#0088FE', '#00C49F'];


const pieChartData = preparePieChartData(amortizationSchedule);
const barChartData = prepareBarChartData(amortizationSchedule);
const totalInterestPayable = amortizationSchedule.reduce((sum, entry) => sum + entry.interest, 0);
  const totalPayment = loanAmount + totalInterestPayable;

  const handlePrint = () => {
    const printContent = document.getElementById('print-summary');
    const originalContent = document.body.innerHTML;
  
    document.body.innerHTML = printContent!.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();  // To ensure React re-renders the components
  };
  

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Loan Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <SliderInput
              label="Loan Amount"
              value={loanAmount}
              onChange={setLoanAmount}
              min={1000}
              max={1000000}
              step={1000}
              unit="₹"
            />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Loan Term</Label>
                <div className="flex items-center space-x-2">
                  <span>Months</span>
                  <Switch checked={isYears} onCheckedChange={toggleYearsMonths} />
                  <span>Years</span>
                </div>
              </div>
              <SliderInput
                label=""
                value={loanTerm}
                onChange={handleLoanTermChange}
                min={isYears ? 1 : 12}
                max={isYears ? 30 : 360}
                step={isYears ? 1 : 12}
                unit={isYears ? "Years" : "Months"}
              />
            </div>
            <SliderInput
              label="Interest Rate"
              value={interestRate}
              onChange={setInterestRate}
              min={0.1}
              max={20}
              step={0.1}
              unit="%"
            />
            <Button type="submit" className="w-full">Calculate</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 w-full">
        <CardHeader>
          <CardTitle className="text-xl">Input Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-semibold">Loan Amount</p>
              <p>₹{loanAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold">Loan Term</p>
              <p>{isYears ? `${loanTerm} years` : `${loanTerm} months`}</p>
            </div>
            <div>
              <p className="font-semibold">Interest Rate</p>
              <p>{interestRate.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {amortizationSchedule.length > 0 && (
        
        <div ref={componentRef} className='mt-8'>
          <h2 id="print-summary" className='text-2xl  font-bold mb-4'>Payment Breakdown</h2>

          <Card className="mt-6 w-full">
        <CardHeader>
          <CardTitle className="text-xl">EMI Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-semibold">Loan EMI</p>
              <p>₹ {amortizationSchedule[0].emi.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Total Interest Payable</p>
              <p>₹ {totalInterestPayable.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Total Payment(Principal + Interest) </p>
              <p>₹ {totalPayment.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
       
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 p-4">
          <h3 className="text-xl font-semibold mb-2">Overall Principal vs Interest</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <h3 className="text-xl font-semibold mb-2">Principal vs Interest Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="principal" fill="#0088FE" stackId="a" name="Principal" />
              <Bar dataKey="interest" fill="#00C49F" stackId="a" name="Interest" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    
        <Card className="mt-6 w-full">
          <CardHeader>
            <CardTitle className="text-xl">Amortization Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
  <table className="w-full border-collapse border border-gray-300">
    <thead>
      <tr className="bg-gray-100">
        <th className="border border-gray-300 px-4 py-2 text-left">Month</th>
        <th className="border border-gray-300 px-4 py-2 text-right">Beginning Balance</th>
        <th className="border border-gray-300 px-4 py-2 text-right">EMI</th>
        <th className="border border-gray-300 px-4 py-2 text-right">Principal</th>
        <th className="border border-gray-300 px-4 py-2 text-right">Interest</th>
        <th className="border border-gray-300 px-4 py-2 text-right">Ending Balance</th>
      </tr>
    </thead>
    <tbody>
      {amortizationSchedule.map((entry) => (
        <tr key={entry.month} className="hover:bg-gray-50">
          <td className="border border-gray-300 px-4 py-2">{entry.month}</td>
          <td className="border border-gray-300 px-4 py-2 text-right">₹{entry.beginningBalance.toFixed(2)}</td>
          <td className="border border-gray-300 px-4 py-2 text-right">₹{entry.emi.toFixed(2)}</td>
          <td className="border border-gray-300 px-4 py-2 text-right">₹{entry.principalPayment.toFixed(2)}</td>
          <td className="border border-gray-300 px-4 py-2 text-right">₹{entry.interest.toFixed(2)}</td>
          <td className="border border-gray-300 px-4 py-2 text-right">₹{entry.endingBalance.toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  </table>
  <ReactToPrint
  trigger={() =>  <Button type="button" className="w-full mt-4">Print Payment Summary</Button>}
  content={() => componentRef.current}
  onBeforeGetContent={() => {
    
  }}
  onAfterPrint={() => {
    
  }}
/>
</div>
          </CardContent>
        </Card>
        </div>
      )}


    </div>
  );
};

export default LoanCalculator;