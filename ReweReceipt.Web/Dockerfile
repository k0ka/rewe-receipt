FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
RUN apt-get update
RUN apt-get install -y npm
RUN npm install -g pnpm
COPY ["ReweReceipt.Web/ReweReceipt.Web.csproj", "ReweReceipt.Web/"]
RUN dotnet restore "ReweReceipt.Web/ReweReceipt.Web.csproj"
COPY . .
WORKDIR "/src/ReweReceipt.Web"
RUN dotnet build "./ReweReceipt.Web.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ReweReceipt.Web.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
RUN chown $APP_UID /app/publish/data

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
VOLUME /app/data
ENTRYPOINT ["dotnet", "ReweReceipt.Web.dll"]
