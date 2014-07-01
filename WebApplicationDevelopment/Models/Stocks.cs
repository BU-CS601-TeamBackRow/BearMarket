using System;
using System.Data.Entity;

namespace WebApplicationDevelopment.Models
{
    public class Stocks
    {
        public String symbol { get; set; }
        public float currentPrice { get; set;}
    }

    public class StocksDBContext : DbContext
    {
        public  DbSet <Stocks> Stocks { get; set; }
    }
}