using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back_end.Migrations
{
    /// <inheritdoc />
    public partial class movedAttributeForPrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Ticket");

            migrationBuilder.AddColumn<int>(
                name: "Price",
                table: "Trips",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Trips");

            migrationBuilder.AddColumn<int>(
                name: "Price",
                table: "Ticket",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
