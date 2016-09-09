namespace HCRS_API.Models
{
    public class ClaimData
    {
        public string Ignorred { get; set; }
        public string Status { get; set; }
        public int Line { get; set; }
        public int PgmId { get; set; }
        public string StateCd { get; set; }
        public string Ndc11 { get; set; }
        public int PeriodCoveredQYYYY { get; set; }
        public float UnitRebateAmount { get; set; }
        public float UnitReimbursed { get; set; }
        public float RebateClaimedAmount { get; set; }
        public float ScriptCnt { get; set; }
        public float MedicaidReimbAmount { get; set; }
        public float NonMedicaidReimbAmount { get; set; }
        public float TotalReimbAmount { get; set; }
        public string CorrFlag { get; set; }
        public string ErrorDescription { get; set; }

    }
}