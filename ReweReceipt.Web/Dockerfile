FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ReweReceipt.Web/ReweReceipt.Web.csproj", "ReweReceipt.Web/"]
RUN dotnet restore "ReweReceipt.Web/ReweReceipt.Web.csproj"
COPY . .
WORKDIR "/src/ReweReceipt.Web"
RUN dotnet build "./ReweReceipt.Web.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ReweReceipt.Web.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ReweReceipt.Web.dll"]
