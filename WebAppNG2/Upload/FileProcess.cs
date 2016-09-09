using HCRS_API.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Reactive.Linq;
using System.Text;

namespace HCRS_API.Services.Upload
{
    public abstract class FileProcess<T>
    {
        private List<T> data = new List<T>();
        
        public FileProcess()
        {

        }
        public IObservable<ResponseData> GetPagedList(string filePath, int pageSize, int pageNo, string sort = "")
        {
            var res = new ResponseData();
            try
            {
                ReadFile(filePath);
                res.TotalPage= (int)Math.Ceiling((double)data.Count / pageSize);               
                var sortData = String.IsNullOrEmpty(sort) ? data : Sort(sort);
                pageNo--;
                res.Data = sortData.Skip(pageNo * pageSize).Take(pageSize);
            }
            catch (Exception ex)
            {

                res.Error = ex.ToString();
            }
            return Observable.Return(res);
        }
        public List<T> GetRecordList(string filePath)
        {
            this.ReadFile(filePath);
            return this.data;
        }
        public void UpdateFile(string filePath, List<T> recordList)
        {
            StringBuilder sb = new StringBuilder();
            var lineNo = 0;
            foreach (var item in recordList)
            {
                lineNo++;
                sb.Append(DecodeLineData(item, lineNo));
                sb.AppendLine();
            }
            File.WriteAllText(filePath, sb.ToString());
        }
        protected void ReadFile(string filePath)
        {
            if (!File.Exists(filePath))
            {
                throw new Exception("Error - File not exist.");
            }
            using (var file = new StreamReader(filePath))
            {
                string content = "";
                int lineNo = 0;
                while ((content = file.ReadLine()) != null)
                {
                    lineNo++;
                    data.Add(EncodeLineData(content, lineNo));
                }

                file.Close();
            }
        }
        public abstract T EncodeLineData(string rawData, int lineNo);
        public abstract string DecodeLineData(T record, int lineNo);
        #region Sort
        protected List<T> Sort(string sort)
        {
            var sortArr = sort.Split('_');
            var propertyName = sortArr[0];
            var orderBy = sortArr[1];
            propertyName = char.ToUpperInvariant(propertyName[0]) + propertyName.Substring(1);

            var sortedList = orderBy == "asc"
                            ? from data in data
                              orderby GetPropertyValue(data, propertyName)
                              select data
                            : from data in data
                              orderby GetPropertyValue(data, propertyName) descending
                              select data;

            return sortedList.ToList();
        }
        protected object GetPropertyValue(object obj, string property)
        {
            System.Reflection.PropertyInfo propertyInfo = obj.GetType().GetProperty(property);
            return propertyInfo.GetValue(obj, null);
        } 
        #endregion
    }
}