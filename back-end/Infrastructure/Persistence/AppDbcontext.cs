using backend.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System.Runtime.Intrinsics.Arm;

namespace backend.Infrastructure.Services
{
    public class AppDbcontext : DbContext
    {
        public AppDbcontext(DbContextOptions<AppDbcontext> options)
    : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId);

            // Station
            modelBuilder.Entity<Station>()
                .HasKey(s => s.Code);

            modelBuilder.Entity<Station>()
                .Property(s => s.Code)
                .IsRequired()
                .HasMaxLength(10);

            modelBuilder.Entity<Station>()
                .Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(100);

            // Train
            modelBuilder.Entity<Train>()
                .HasKey(t => t.Code);

            modelBuilder.Entity<Train>()
                .Property(t => t.Code)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Train>()
                .Property(t => t.Type)
                .HasMaxLength(50);

            modelBuilder.Entity<Train>()
                .Property(t => t.Status)
                .HasMaxLength(20);

            // Trip
            modelBuilder.Entity<Trip>()
                .HasKey(tr => tr.Code);

            modelBuilder.Entity<Trip>()
                .HasOne(tr => tr.Train)
                .WithMany(t => t.Trips)
                .HasForeignKey(tr => tr.TrainId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Trip>()
                .HasOne(tr => tr.DepartureStation)
                .WithMany(s => s.DepartureTrips)
                .HasForeignKey(tr => tr.DepartureStationId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Trip>()
                .HasOne(tr => tr.ArrivalStation)
                .WithMany(s => s.ArrivalTrips)
                .HasForeignKey(tr => tr.ArrivalStationId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Trip>()
                .Property(tr => tr.Status)
                .HasMaxLength(20);
            // Ticket
            modelBuilder.Entity<Ticket>().HasKey(t => t.Code);
            modelBuilder.Entity<Ticket>().Property(t => t.QrCode).HasMaxLength(30);
            modelBuilder.Entity<Ticket>().HasOne(t => t.Client).WithMany(u => u.Tickets).HasForeignKey(t => t.ClientId).OnDelete(DeleteBehavior.Restrict);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }

        public DbSet<Station> Stations { get; set; }
        public DbSet<Train> Trains { get; set; }
        public DbSet<Trip> Trips { get; set; }
    }
}
