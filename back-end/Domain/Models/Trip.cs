
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using AccountService.Exceptions;
using Microsoft.VisualBasic;
namespace backend.Domain.Models
{
    public class Trip
    {

        public Trip()
        {
        }
        public Trip(DateTime departureDate, DateInterval duration, DateInterval delay, string status, int price, int departureStationId, int arrivalStationId, int trainId)
        {
            if (DepartureStationId == arrivalStationId)
                throw new BusinessRuleException("Source and destination stations cannot be the same.");

            DepartureDate = departureDate;
            Duration = duration;
            Delay = delay;
            Status = status;
            Price = price;
            DepartureStationId = departureStationId;
            ArrivalStationId = arrivalStationId;
            TrainId = trainId;
        }
        public void Update(DateTime departureDate, DateInterval duration, DateInterval delay, string status, int price, int trainId, int departureStationId, int arrivalStationId)
        {
            if (DepartureStationId == arrivalStationId)
                throw new BusinessRuleException("Source and destination stations cannot be the same.");

            DepartureDate = departureDate;
            Duration = duration;
            Delay = delay;
            Status = status;
            Price = price;
            TrainId = trainId;
            ArrivalStationId = arrivalStationId;
            DepartureStationId = departureStationId;
        }
        [Key]
        public int Code { get; set; }
        [Required]
        public DateTime DepartureDate { get; set; }
        [Required]

        public DateInterval Duration { get; set; }
        [Required]

        public DateInterval Delay { get; set; }
        [Required]

        public string Status { get; set; }

        [Required]
        public int Price { get; set; }
        [Required]
        public Station DepartureStation { get; set; }
        public int DepartureStationId { get; set; }
        [Required]
        public Station ArrivalStation { get; set; }
        public int ArrivalStationId { get; set; }
        [Required]
        public Train Train { get; set; }
        public int TrainId { get; set; }
    }
}