const userId = document.getElementById('userId');
const section = document.getElementById('section');
const Day = document.getElementById('Day');
const endRoll = document.getElementById('endRoll');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const removeBtn = document.getElementById('removeBtn'); 

const database = firebase.database();

const usersRef = database.ref('/users');
addBtn.addEventListener('click', e => {
  e.preventDefault();
  const autoId = usersRef.push().key
  usersRef.child(userId.value).set({
    section: section.value,
    Day: Day.value,
    endRoll: endRoll.value
  });
});

updateBtn.addEventListener('click', e => {
    e.preventDefault();
    const newData = {
        section: section.value,
        Day: Day.value,
        endRoll: endRoll.value
    };
    usersRef.child(userId.value).update(newData);
});
  
removeBtn.addEventListener('click', e => {
    e.preventDefault();
    usersRef.child(userId.value).remove()
    .then(()=> { console.log('User Deleted !'); })
    .catch(error => { console.error(error); });
});

usersRef.orderByChild('Day').limitToFirst(2).on('value', snapshot => {
    console.log(snapshot.val());
});

