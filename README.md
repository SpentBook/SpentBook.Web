# Configure migrations aspnetcore 3.1

dotnet new tool-manifest
dotnet tool install dotnet-ef
dotnet add package Microsoft.EntityFrameworkCore.Design --version 3.1.1
dotnet ef migrations add "MIGRATE_$(date +'%Y%m%d_%H%M')"

# Instalar no OpenShift

oc new-app 'https://github.com/SpentBook/SpentBook.Web.git' \
--strategy=docker \
--name=spent-book-web \
--context-dir src/SpentBook.Web \
--build-env DOTNET_STARTUP_PROJECT=SpentBook.Web.csproj \
--build-env DOTNET_CONFIGURATION=Release