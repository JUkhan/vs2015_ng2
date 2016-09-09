using HCRS_API.Models;
using HCRS_API.Services.Upload;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace HCRS_API.Services.Upload
{
    public class ClaimFile : FileProcess<ClaimData>
    {
        private float GetDecimal(string value, int divBy)
        {
            float val = float.Parse(value);
            return val;
            //return value.Contains('.')?val: val / divBy;           
        }
        private decimal GetDecimal(Decimal val, int divBy)
        {
            string value = val.ToString();
            return value.Contains('.') ? val : val * divBy;
        }
        public override ClaimData EncodeLineData(string rawData, int lineNo)
        {            
            var claimData = new ClaimData();
            claimData.Status = "Ok";
            claimData.Line = lineNo;
            claimData.PgmId = Convert.ToInt32(rawData.Substring(0, 4));
            claimData.StateCd = rawData.Substring(4, 2);
            claimData.Ndc11 = rawData.Substring(6, 11);
            claimData.PeriodCoveredQYYYY = Convert.ToInt32(rawData.Substring(17, 5));
            claimData.Ignorred = rawData.Substring(22, 10);
            claimData.UnitRebateAmount = GetDecimal(rawData.Substring(32, 12), 1000000);
            claimData.UnitReimbursed = GetDecimal(rawData.Substring(44, 15),  1000);
            claimData.RebateClaimedAmount = GetDecimal(rawData.Substring(59, 12),  100);

            //claimData.ScriptCnt = Convert.ToDecimal(rawData.Substring(71, 8));
            claimData.ScriptCnt = float.Parse(rawData.Substring(71, 8));

            claimData.MedicaidReimbAmount = GetDecimal(rawData.Substring(79, 13),  100);
            claimData.NonMedicaidReimbAmount =GetDecimal(rawData.Substring(93, 13), 100);
            claimData.TotalReimbAmount = GetDecimal(rawData.Substring(105, 14), 100);

            claimData.CorrFlag = rawData.Substring(119, 1);
            claimData.ErrorDescription = "";

            return claimData;
        }

        public override string DecodeLineData(ClaimData record, int lineNo)
        {
            StringBuilder sb = new StringBuilder();
            //sb.Append("Ok");
            //sb.Append(record.Line);
            sb.AppendFormat("{0:0000}", record.PgmId);
            sb.Append(record.StateCd);
            sb.Append(record.Ndc11);
            sb.AppendFormat("{0:00000}",record.PeriodCoveredQYYYY);
            sb.AppendFormat(record.Ignorred);
            sb.AppendFormat("{0:000000000000}",record.UnitRebateAmount);
            sb.AppendFormat("{0:000000000000000}",record.UnitReimbursed);
            sb.AppendFormat("{0:000000000000}",record.RebateClaimedAmount);
            sb.AppendFormat("{0:00000000}",record.ScriptCnt);
            sb.AppendFormat("{0:0000000000000}",record.MedicaidReimbAmount);
            sb.AppendFormat("{0:0000000000000}",record.NonMedicaidReimbAmount);
            sb.AppendFormat("{0:00000000000000}", record.TotalReimbAmount);
            sb.Append(record.CorrFlag);
            //sb.Append(record.ErrorDescription);
            
            return sb.ToString();
        }
    }
}