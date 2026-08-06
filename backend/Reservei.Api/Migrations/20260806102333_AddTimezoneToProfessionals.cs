using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reservei.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTimezoneToProfessionals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Timezone",
                table: "Professionals",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Timezone",
                table: "Professionals");
        }
    }
}
