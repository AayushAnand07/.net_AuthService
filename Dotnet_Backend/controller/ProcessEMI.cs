using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

public class AmortizationController : ControllerBase
{
    [HttpGet]
    [Route("api/amortizationSchedule")]
    [EnableCors("AllowReactApp")]
    public IActionResult GetAmortizationSchedule([FromQuery] LoanDetails loanDetails)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var amortizationSchedule = CalculateAmortizationSchedule(loanDetails.PrincipalAmount, loanDetails.InterestRate, loanDetails.LoanTermInMonths);
        return Ok(amortizationSchedule);
    }

    private List<AmortizationEntry> CalculateAmortizationSchedule(decimal principalAmount, decimal annualInterestRate, int loanTermInMonths)
    {
        var monthlyInterestRate = annualInterestRate / 12 / 100;
        var emi = CalculateEMI(principalAmount, monthlyInterestRate, loanTermInMonths);

        var amortizationSchedule = new List<AmortizationEntry>();
        decimal remainingBalance = principalAmount;

        for (int month = 1; month <= loanTermInMonths; month++)
        {
            var interest = remainingBalance * monthlyInterestRate;
            var principalPayment = emi - interest;
            var endingBalance = remainingBalance - principalPayment;
             if(endingBalance ==0 ) break;
            if(endingBalance<0){
               endingBalance=0;
               
            }
           
            
            amortizationSchedule.Add(new AmortizationEntry
            {
                Month = month,
                BeginningBalance = remainingBalance,
                Interest = interest,
                PrincipalPayment = principalPayment,
                EMI = emi,
                EndingBalance = endingBalance
            });

            remainingBalance = endingBalance;
        }

        return amortizationSchedule;
    }

    private static decimal CalculateEMI(decimal principal, decimal monthlyInterestRate, int loanTermInMonths)
    {
        decimal emi = principal * monthlyInterestRate * (decimal)Math.Pow((double)(1 + monthlyInterestRate), loanTermInMonths) /
                      ((decimal)Math.Pow((double)(1 + monthlyInterestRate), loanTermInMonths) - 1);

        return emi;
    }
}


