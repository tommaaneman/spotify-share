var arr = [{
    id: 1,
    name: 'bill'
  }, {
    id: 2,
    name: 'ted'
  }]
  
  var result = arr.find(person => person.id === 2).name;
  console.log(Array.from(Array(50).keys()))