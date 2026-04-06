# Test Food Order API

$body = @{
    name = "Test Customer"
    room = 101
    phone = "9876543210"
    items = @(
        @{item="Biryani"; quantity=1; price=350},
        @{item="Naan"; quantity=2; price=50}
    )
    total = 450
    customer_email = "test@example.com"
    status = "pending"
    payment_method = "upi"
    payment_txn_id = "FOODPAY-1234567890"
    payment_reference = "UPI12345"
} | ConvertTo-Json -Depth 5

Write-Host "Creating food order..."
Write-Host "Body: $body"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/food-orders" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    Write-Host "✅ Success! Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response.StatusCode)"
}

Write-Host ""
Write-Host "Fetching all food orders..."
try {
    $orders = Invoke-WebRequest -Uri "http://localhost:5000/api/food-orders" -Method GET
    $ordersData = $orders.Content | ConvertFrom-Json
    Write-Host "✅ Total orders: $($ordersData.Count)"
    Write-Host "Orders: $($orders.Content)"
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
}
