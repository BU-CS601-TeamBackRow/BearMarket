using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization.Json;
using WebApplicationDevelopment.Models;
using System.Net;

namespace WebApplicationDevelopment.Utilities
{
    public class Fetcher
    {
        static string yahooFinanceKey = ""; //Insert Yahoo! Fianance Key here

        public Stocks driver(string symbol)
        {
            try
            {
                string locationsRequest = createRequest(symbol);
                Response locationsResponse = makeRequest(locationsRequest);
                processResponse(locationsResponse);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                Console.Read();
            }
            return null; 
        }

        private string createRequest(string symbol)
        {
            string requestString = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20%3D%20'" + symbol + "'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
            return requestString;
        }

        private Response makeRequest(string requestString)
        {
            try
            {
                HttpWebRequest request = WebRequest.Create(requestString) as HttpWebRequest;
                using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
                {
                    if (response.StatusCode != HttpStatusCode.OK)
                        throw new Exception(String.Format(
                        "Server error (HTTP {0}: {1}).",
                        response.StatusCode,
                        response.StatusDescription));
                    DataContractJsonSerializer jsonSerializer = new DataContractJsonSerializer(typeof(Response));
                    object objResponse = jsonSerializer.ReadObject(response.GetResponseStream());
                    Response jsonResponse
                    = objResponse as Response;
                    return jsonResponse;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        }

        private void processResponse(Response stockResponse)
        {

        }
    }
}