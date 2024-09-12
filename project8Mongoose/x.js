/**POST /api/returns  {customerId, movieId}
 * return 401 if client is not logged in
 * return 400 if customerid is not provided
 * return 400 if movieId not provided
 * return 404 if no rental found for this customer/movie
 * return 400 if rental already processed
 * 
 * return 200 if valid request 
 * set return date
 * calculate the rental fee
 * increase the stock
 * return the rental
 */