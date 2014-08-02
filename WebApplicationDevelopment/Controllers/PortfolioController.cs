using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Owin;
using System.Collections.Specialized;

namespace WebApplicationDevelopment.Controllers
{
    public class PortfolioController : ApiController
    {
        [Route("api/portfolio")]
        [HttpPost]
        public HttpResponseMessage addStockToPortfolio()
        {
            try
            {
                //Load Form variables into NameValueCollection variable.
                var coll = Request.GetQueryNameValuePairs().ToDictionary(x => x.Key, x => x.Value);
                string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["StocksDBContext"].ConnectionString;
                // Provide the query string with a parameter placeholder. 
                string queryString =
                    "INSERT INTO dbo.portfolio Output inserted.Id "
                        + " VALUES(NEWID(), @userId, @symbol, @pricePaid, @sharesPurchased, null );";
                //string idQuery = "Select @@Identity";

                // Specify the parameter value. 
                string userId = User.Identity.GetUserId();
                string symbol = coll["Symbol"];
                string pricePaid = coll["PricePaid"];
                string sharesPurchased = coll["SharesPurchase"];


                // Create and open the connection in a using block. This 
                // ensures that all resources will be closed and disposed 
                // when the code exits. 
                using (SqlConnection connection =
                    new SqlConnection(connectionString))
                {
                    // Create the Command and Parameter objects.
                    SqlCommand command = new SqlCommand(queryString, connection);
                    command.Parameters.AddWithValue("@userId", userId);
                    command.Parameters.AddWithValue("@symbol", symbol);
                    command.Parameters.AddWithValue("@pricePaid", pricePaid);
                    command.Parameters.AddWithValue("@sharesPurchased", sharesPurchased);
                    // Open the connection in a try/catch block.  
                    // Create and execute the DataReader, writing the result 
                    // set to the console window. 
                    try
                    {
                        connection.Open();
                        //Int32 rowsAffected = command.ExecuteNonQuery();
                        //command.CommandText = idQuery;
                        Guid retGuid = Guid.Empty;
                        retGuid = (Guid)command.ExecuteScalar();
                        String retId = retGuid.ToString();
                        Console.WriteLine("return: " + retId);
                        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, "value");
                        response.Content = new StringContent(retId, Encoding.Unicode);
                        response.Headers.CacheControl = new CacheControlHeaderValue()
                        {
                            MaxAge = TimeSpan.FromMinutes(20)
                        };
                        return response;
                    }
                    catch (System.Data.SqlClient.SqlException sqlException)
                    {
                        System.Windows.Forms.MessageBox.Show(sqlException.Message);
                        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.InternalServerError, "value");
                        return response;
                    }
                    catch (Exception ex)
                    {
                        System.Windows.Forms.MessageBox.Show(ex.Message);
                        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.InternalServerError, "value");
                        return response;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                var resp = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                throw new HttpResponseException(resp);
            }
        }
        [Route("api/portfolio")]
        [HttpDelete]
        public IHttpActionResult deleteStockFromPortfolio()
        {
            try
            {
                //Load Form variables into NameValueCollection variable.
                var coll = Request.GetQueryNameValuePairs().ToDictionary(x => x.Key, x => x.Value);                // TODO: Add insert logic here
                string connectionString = "Data Source=(LocalDB)\\v11.0;AttachDbFilename=C:\\Users\\Danny\\Documents\\GitHub\\BearMarket\\WebApplicationDevelopment\\App_Data\\Stocks.mdf;Integrated Security=True";

                // Provide the query string with a parameter placeholder. 
                string queryString =
                    "DELETE FROM dbo.portfolio WHERE Id = @Id;";

                // Specify the parameter value. 
                string Id = coll["Id"];

                // Create and open the connection in a using block. This 
                // ensures that all resources will be closed and disposed 
                // when the code exits. 
                using (SqlConnection connection =
                    new SqlConnection(connectionString))
                {
                    // Create the Command and Parameter objects.
                    SqlCommand command = new SqlCommand(queryString, connection);
                    command.Parameters.AddWithValue("@Id", Id);
                    // Open the connection in a try/catch block.  
                    // Create and execute the DataReader, writing the result 
                    // set to the console window. 
                    try
                    {
                        connection.Open();
                        Int32 rowsAffected = command.ExecuteNonQuery();
                    }
                    catch (System.Data.SqlClient.SqlException sqlException)
                    {
                        System.Windows.Forms.MessageBox.Show(sqlException.Message);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                var resp = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                throw new HttpResponseException(resp);
            }
        }

        [Route("api/portfolio")]
        [HttpPut]
        public IHttpActionResult updateStockInPortfolio()
        {
            try
            {
                //Load Form variables into NameValueCollection variable.
                var coll = Request.GetQueryNameValuePairs().ToDictionary(x => x.Key, x => x.Value);                // TODO: Add insert logic here
                string connectionString = "Data Source=(LocalDB)\\v11.0;AttachDbFilename=C:\\Users\\Danny\\Documents\\GitHub\\BearMarket\\WebApplicationDevelopment\\App_Data\\Stocks.mdf;Integrated Security=True";

                // Provide the query string with a parameter placeholder. 
                string queryString =
                    "UPDATE dbo.portfolio SET PriceSold = @PriceSold WHERE Id = @Id;";

                // Specify the parameter value. 
                string Id = coll["Id"];
                string PriceSold = coll["PriceSold"];

                // Create and open the connection in a using block. This 
                // ensures that all resources will be closed and disposed 
                // when the code exits. 
                using (SqlConnection connection =
                    new SqlConnection(connectionString))
                {
                    // Create the Command and Parameter objects.
                    SqlCommand command = new SqlCommand(queryString, connection);
                    command.Parameters.AddWithValue("@PriceSold", PriceSold);
                    command.Parameters.AddWithValue("@Id", Id);
                    // Open the connection in a try/catch block.  
                    // Create and execute the DataReader, writing the result 
                    // set to the console window. 
                    try
                    {
                        connection.Open();
                        Int32 rowsAffected = command.ExecuteNonQuery();
                    }
                    catch (System.Data.SqlClient.SqlException sqlException)
                    {
                        System.Windows.Forms.MessageBox.Show(sqlException.Message);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                var resp = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                throw new HttpResponseException(resp);
            }
        }
    }
}
