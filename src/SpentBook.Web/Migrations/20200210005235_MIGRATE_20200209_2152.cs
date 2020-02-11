using Microsoft.EntityFrameworkCore.Migrations;

namespace SpentBook.Web.Migrations
{
    public partial class MIGRATE_20200209_2152 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FacebookId",
                table: "AspNetUsers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "FacebookId",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: 0L);
        }
    }
}
