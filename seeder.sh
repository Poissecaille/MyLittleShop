echo "START SEED IMPLEMENTATION IN DATABASE"
start=$SECONDS
cd authentication
pwd
npx sequelize-cli db:seed --seed 20220212150215-users.js
npx sequelize-cli db:seed --seed 20220216092309-userAddresses.js
cd ../inventory
pwd
npx sequelize-cli db:seed --seed 20220213104607-tags.js
npx sequelize-cli db:seed --seed 20220205122444-categories.js
npx sequelize-cli db:seed --seed 20220205145748-products.js
npx sequelize-cli db:seed --seed 20220215163402-cartProduct
echo "SEED IMPLEMENTATION FINISHED in $(( SECONDS - start )) seconds"
sleep 5s 