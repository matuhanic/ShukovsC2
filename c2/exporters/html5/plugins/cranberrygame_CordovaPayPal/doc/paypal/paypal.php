<?php

/*
//usage: http://www.yourserver.com/paypal/paypal.php?payment_id=PAY-5YK922393D847794YKER7MUI&payment_amount=1.00&payment_currency=USD&payment_short_description=Slide+Puzzle+Remove+Ads&payment_create_time=2014-10-27T11:10:30Z
//return: "approved" or "The requested resource ID was not found"
*/

//////////////////////////////////////////////////////
$client_id = "YOUR_APP_CLIENT_ID"; //per app
$secret = "YOUR_APP_SECRET"; //per app
//////////////////////////////////////////////////////

$payment_id = $_GET['payment_id'];
$payment_amount = $_GET['payment_amount'];
$payment_currency = $_GET['payment_currency'];
$payment_short_description = $_GET['payment_short_description'];
$payment_create_time = $_GET['payment_create_time'];

$state = get_state($client_id, $secret, $payment_id);
print $state;

if($state == "approved") {
	insert_into_your_database($payment_id, $payment_amount, $payment_currency, $payment_short_description, $payment_create_time);
}

function insert_into_your_database($payment_id, $payment_amount, $payment_currency, $payment_short_description, $payment_create_time)
{

}

function get_state($client_id, $secret, $payment_id)
{
/*
curl https://api.sandbox.paypal.com/v1/payments/payment/PAY-5YK922393D847794YKER7MUI \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer {accessToken}"
*/ 
	$access_token = get_access_token($client_id, $secret);
	$ch = curl_init("https://api.sandbox.paypal.com/v1/payments/payment/".$payment_id);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Authorization: Bearer '.$access_token));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

	//
	$content = curl_exec($ch);
	curl_close($ch);
	//print $content

	$json = json_decode($content);
	$state = $json->{'state'};
	if (!$state)
		$state = $json->{'message'};
	//print $state;
	return $state;
}

function get_access_token($client_id, $secret)
{
/*
curl -v https://api.sandbox.paypal.com/v1/oauth2/token \
  -H "Accept: application/json" \
  -H "Accept-Language: en_US" \
  -u "EOJ2S-Z6OoN_le_KS1d75wsZ6y0SFdVsY9183IvxFyZp:EClusMEUk8e9ihI7ZdVLF5cZ6y0SFdVsY9183IvxFyZp" \
  -d "grant_type=client_credentials"
*/

	$ch = curl_init("https://api.sandbox.paypal.com/v1/oauth2/token");
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Accept-Language: en_US'));
	curl_setopt($ch, CURLOPT_USERPWD, $client_id . ":" . $secret);  
	$data = http_build_query(array(
	   'grant_type'  => 'client_credentials'
	));
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	////curl_setopt($ch, CURLOPT_HEADER, 0);

	//{"scope":"https://api.paypal.com/v1/developer/.* https://api.paypal.com/v1/payments/.* https://api.paypal.com/v1/vault/credit-card https://api.paypal.com/v1/vault/credit-card/.*","access_token":"A0152Yu3qoaeqHe3UmsWaciU.jRf3xUIRJO0Ykfn3m8uScY","token_type":"Bearer","app_id":"APP-8KK24973T6066201W","expires_in":28800}
	$content = curl_exec($ch);
	curl_close($ch);
	//print $content;

	$json = json_decode($content);
	$access_token = $json->{'access_token'};
	//print $access_token; // A0152Yu3qoaeqHe3UmsWaciU.jRf3xUIRJO0Ykfn3m8uScY
	
	return $access_token;
}
?>