//Building a promise

const lotteryPromise = new Promise(function (resolve, reject) {
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You WIN 💰'); //This is how we set a fulfilled promise.
    } else {
      reject(new Error('You lost your money 😖')); //This is how we set a rejected promise.
    }
  }, 2000); //this makes the promise execute after 2 seconds, making it asynch
});

lotteryPromise.then(res => console.log(res)).catch(err => console.log(err)); //Once built, here we consume the promise with the then and catch methods.

//Promise.resolve('resolve value') is a why to instantly construct a resolved promise
