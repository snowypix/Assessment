
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using AccountService.Exceptions;
using backend.Domain.Events;
using MediatR;
using Microsoft.VisualBasic;
namespace backend.Domain.Models
{
    public class Trip
    {

        public Trip()
        {
        }
        public Trip(DateTime departureDate, int duration, int delay, string status, int price, int departureStationId, int arrivalStationId, int trainId)
        {
            if (departureStationId == arrivalStationId)
                throw new BusinessRuleException("Source and destination stations cannot be the same.");
            if (price < 0)
            {
                throw new BusinessRuleException("Price can't be negative.");
            }
            DepartureDate = departureDate;
            Duration = duration;
            Delay = delay;
            Status = status;
            Price = price;
            DepartureStationId = departureStationId;
            ArrivalStationId = arrivalStationId;
            TrainId = trainId;
        }
        public void Update(DateTime departureDate, int duration, int delay, string status, int price, int trainId, int departureStationId, int arrivalStationId)
        {
            if (departureStationId == arrivalStationId)
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
        private readonly List<INotification> _domainEvents = new();
        public IReadOnlyCollection<INotification> DomainEvents => _domainEvents.AsReadOnly();

        public void DelayTrip(int minutes)
        {
            Delay = Delay + minutes;
            Status = "Delayed";
            _domainEvents.Add(new TripDelayedEvent(Code, minutes));
        }
        public void ClearDomainEvents() => _domainEvents.Clear();
        [Key]
        public int Code { get; set; }
        [Required]
        public DateTime DepartureDate { get; set; }
        [Required]

        public int Duration { get; set; }
        [Required]

        public int Delay { get; set; }
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
        public ICollection<Ticket> Tickets { get; set; }
    }
}