public class LoanDetails
{
    public decimal PrincipalAmount { get; set; }
    public decimal InterestRate { get; set; }
    public int LoanTermInMonths { get; set; }
}

public class AmortizationEntry
{
    public int Month { get; set; }
    public decimal BeginningBalance { get; set; }
    public decimal Interest { get; set; }
    public decimal PrincipalPayment { get; set; }
    public decimal EMI { get; set; }
    public decimal EndingBalance { get; set; }
}