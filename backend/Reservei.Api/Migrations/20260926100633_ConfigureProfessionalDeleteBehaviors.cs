using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Reservei.Api.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureProfessionalDeleteBehaviors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Professionals_ProfessionalId",
                table: "Appointments");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProfessionalId",
                table: "Appointments",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Professionals_ProfessionalId",
                table: "Appointments",
                column: "ProfessionalId",
                principalTable: "Professionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Professionals_ProfessionalId",
                table: "Appointments");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProfessionalId",
                table: "Appointments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Professionals_ProfessionalId",
                table: "Appointments",
                column: "ProfessionalId",
                principalTable: "Professionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
