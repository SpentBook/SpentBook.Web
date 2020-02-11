# Configure migrations aspnetcore 3.1

dotnet new tool-manifest
dotnet tool install dotnet-ef
dotnet add package Microsoft.EntityFrameworkCore.Design --version 3.1.1
dotnet ef migrations add "MIGRATE_$(date +'%Y%m%d_%H%M')"