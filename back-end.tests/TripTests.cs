using System;
using Xunit;
using FluentAssertions;
using backend.Domain.Models;
using AccountService.Exceptions;
using backend.Domain.Events;

public class TripTests
{
    [Fact]
    public void Constructor_ShouldThrow_WhenDepartureAndArrivalAreSame()
    {
        Action act = () => new Trip(
            departureDate: DateTime.UtcNow,
            duration: 120,
            delay: 0,
            status: "Scheduled",
            price: 50,
            departureStationId: 1,
            arrivalStationId: 1,
            trainId: 10
        );
        act.Should().Throw<BusinessRuleException>()
           .WithMessage("Source and destination stations cannot be the same.");
    }

    [Fact]
    public void Constructor_ShouldThrow_WhenPriceIsNegative()
    {
        Action act = () => new Trip(
            departureDate: DateTime.UtcNow,
            duration: 90,
            delay: 0,
            status: "Scheduled",
            price: -20,
            departureStationId: 1,
            arrivalStationId: 2,
            trainId: 10
        );
        act.Should().Throw<BusinessRuleException>()
           .WithMessage("Price can't be negative.");
    }

    [Fact]
    public void Update_ShouldThrow_WhenDepartureAndArrivalAreSame()
    {

        var trip = new Trip(DateTime.UtcNow, 90, 0, "Scheduled", 100, 1, 2, 10);
        Action act = () => trip.Update(
            departureDate: DateTime.UtcNow.AddHours(1),
            duration: 120,
            delay: 0,
            status: "Scheduled",
            price: 80,
            trainId: 10,
            departureStationId: 5,
            arrivalStationId: 5
        );
        act.Should().Throw<BusinessRuleException>()
           .WithMessage("Source and destination stations cannot be the same.");
    }

    [Fact]
    public void DelayTrip_ShouldIncreaseDelay_AndAddDomainEvent()
    {
        var trip = new Trip(DateTime.UtcNow, 90, 0, "Scheduled", 100, 1, 2, 10);
        trip.DelayTrip(15);
        trip.Delay.Should().Be(15);
        trip.Status.Should().Be("Delayed");
        trip.DomainEvents.Should().ContainSingle()
            .Which.Should().BeOfType<TripDelayedEvent>();
    }

    [Fact]
    public void ClearDomainEvents_ShouldRemoveAllEvents()
    {

        var trip = new Trip(DateTime.UtcNow, 90, 0, "Scheduled", 100, 1, 2, 10);
        trip.DelayTrip(30);
        trip.DomainEvents.Should().HaveCount(1);
        trip.ClearDomainEvents();
        trip.DomainEvents.Should().BeEmpty();
    }
}
