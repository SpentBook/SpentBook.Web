FROM mcr.microsoft.com/dotnet/core/aspnet:2.2 AS base
WORKDIR /app
# EXPOSE 5000
# EXPOSE 5001

FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build

# ENV NODE_VERSION v10.18.1

RUN apt-get update
RUN apt-get -y install curl gnupg build-essential
RUN apt-get -qq update && apt-get -qqy --no-install-recommends install wget gnupg \
    git \
    unzip

RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs

# Copia apenas o csproj pra gerar cache (ele não muda toda hora)
WORKDIR /src
COPY ["src/SpentBook.Web/SpentBook.Web.csproj", "./"]
RUN dotnet restore "./SpentBook.Web.csproj"

# Baixa os modulos para gerar cache (ele não muda toda hora)
WORKDIR /src/ClientApp
COPY ["src/SpentBook.Web/ClientApp/package.json", "./"]
RUN npm install 

WORKDIR /src
COPY . .
RUN dotnet build "SpentBook.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SpentBook.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SpentBook.Web.dll"]

# cd /d/Junior/Projetos/VisualStudio.com/SpentBook/src/SpentBook.Web; docker build . --tag spentbook:latest
# docker run --env ASPNETCORE_URLS="http://0.0.0.0:5000" -ti -p 5000:5000 spentbook
# export ASPNETCORE_URLS="http://localhost:4001" && dotnet SpentBook.Web.dll
# dotnet SpentBook.Web.dll --urls="http://localhost:4002"