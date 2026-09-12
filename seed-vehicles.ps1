$api = "http://3.248.251.220:8000"

# -------------------------------------------------
# 1. Supprimer uniquement les anciens véhicules fictifs
# -------------------------------------------------

$oldRegistrations = @(
    "AA-101-AA",
    "BB-202-BB",
    "CC-303-CC",
    "DD-404-DD",
    "EE-505-EE",
    "FF-606-FF",
    "GG-707-GG",
    "HH-808-HH",
    "JJ-909-JJ",
    "KK-110-KK"
)

$existingVehicles = Invoke-RestMethod -Uri "$api/vehicles" -Method Get

foreach ($vehicle in $existingVehicles) {

    if ($oldRegistrations -contains $vehicle.registration) {

        Invoke-RestMethod `
            -Uri "$api/vehicles/$($vehicle.id)" `
            -Method Delete

        Write-Host "Supprime : $($vehicle.brand) $($vehicle.model)"
    }
}


# -------------------------------------------------
# 2. Nouvelle flotte avec photos correspondantes
# -------------------------------------------------

$vehicles = @(

    @{
        brand = "Renault"
        model = "Clio V"
        registration = "AA-101-AA"
        year = 2021
        mileage = 41800
        status = "available"
        image_url = "https://commons.wikimedia.org/wiki/Special:Redirect/file/2019%20Renault%20Clio%20Iconic%20Front.jpg"
    },

    @{
        brand = "Toyota"
        model = "Yaris"
        registration = "BB-202-BB"
        year = 2023
        mileage = 18800
        status = "available"
        image_url = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Toyota%20Yaris%201.5%20E%202023.jpg"
    },

    @{
        brand = "Volkswagen"
        model = "Golf VIII"
        registration = "CC-303-CC"
        year = 2021
        mileage = 59200
        status = "maintenance"
        image_url = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Volkswagen%20Golf%20VIII%20IMG%202607.jpg"
    },

    @{
        brand = "BMW"
        model = "Serie 3"
        registration = "DD-404-DD"
        year = 2022
        mileage = 27600
        status = "rented"
        image_url = "https://commons.wikimedia.org/wiki/Special:Redirect/file/BMW%20G20%20%282022%29%201X7A6121.jpg"
    },

    @{
        brand = "Mercedes"
        model = "Classe A"
        registration = "EE-505-EE"
        year = 2022
        mileage = 36400
        status = "available"
        image_url = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mercedes-Benz%20W177%20%282022%29%201X7A6988.jpg"
    },

    @{
        brand = "Audi"
        model = "A3"
        registration = "FF-606-FF"
        year = 2021
        mileage = 14900
        status = "available"
        image_url = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Audi%20A3%208Y%20IMG%203114.jpg"
    },

    @{
        brand = "Ford"
        model = "Focus"
        registration = "GG-707-GG"
        year = 2022
        mileage = 30700
        status = "rented"
        image_url = "https://commons.wikimedia.org/wiki/Special:Redirect/file/2022%20Ford%20Focus.jpg"
    },

    @{
        brand = "SEAT"
        model = "Leon"
        registration = "HH-808-HH"
        year = 2021
        mileage = 43800
        status = "available"
        image_url = "https://commons.wikimedia.org/wiki/Special:Redirect/file/2021%20Seat%20Leon.jpg"
    },

    @{
        brand = "Kia"
        model = "Ceed"
        registration = "JJ-909-JJ"
        year = 2021
        mileage = 35100
        status = "maintenance"
        image_url = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kia%20Ceed%20%282021%29%20IMG%205550.jpg"
    },

    @{
        brand = "Tesla"
        model = "Model 3"
        registration = "KK-110-KK"
        year = 2022
        mileage = 22100
        status = "rented"
        image_url = "https://commons.wikimedia.org/wiki/Special:Redirect/file/2022%20Tesla%20Model%203.jpg"
    }
)


# -------------------------------------------------
# 3. Ajouter les véhicules
# -------------------------------------------------

foreach ($vehicle in $vehicles) {

    $body = $vehicle | ConvertTo-Json

    try {

        Invoke-RestMethod `
            -Uri "$api/vehicles" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body

        Write-Host "Ajoute : $($vehicle.brand) $($vehicle.model)"

    }
    catch {

        Write-Host "Erreur : $($vehicle.brand) $($vehicle.model)"
        Write-Host $_
    }
}