
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using AccountService.Exceptions;
using Microsoft.VisualBasic;
namespace backend.Domain.Models
{

    public class Ticket
    {

        public Ticket()
        {
        }
        public void CalculatePrice()
        {
            if (Class == 1)
            {
                Price = (int)Math.Ceiling(Trip.Price * 1.5);
                return;
            }
            Price = Trip.Price;
        }
        public void AttachQrCode(string encryptedQr)
        {
            Console.WriteLine(encryptedQr.Length);
            if (encryptedQr.Length > 144)
            {
                throw new BusinessRuleException("QR too long");
            }
            if (string.IsNullOrWhiteSpace(encryptedQr))
                throw new BusinessRuleException("QR cannot be empty");

            QrCode = encryptedQr;
        }
        public void DelayBy(int delay)
        {
            Delay = Delay + delay;
        }
        [Key]
        public int Code { get; set; }
        [Required]
        public string QrCode { get; set; }
        [Required]
        public int Class { get; set; }
        [Required]
        public User Client { get; set; }
        public int ClientId { get; set; }
        [Required]
        public Trip Trip { get; set; }
        public int TripId { get; set; }
        public int Price { get; set; }
        public DateInterval Delay { get; set; }
    }
}