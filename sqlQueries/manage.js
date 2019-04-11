let sqlQueries = {
    getOwnedBranches: 'SELECT B.id, bname, restaurant_id, rname FROM branches B INNER JOIN timeslot T on B.id = T.branch_id INNER JOIN restaurants R on B.restaurant_id = R.id where B.branch_owner_id = $1 GROUP BY rname, B.id;',
    getBranchesAndTimeslots: 'SELECT id, dateslot, timeslot, numslots FROM branches B INNER JOIN timeslot T on B.id = T.branch_id where B.branch_owner_id = $1;',
    deleteTimeslot: 'DELETE FROM Timeslot WHERE branch_id = $1 AND dateslot = $2 AND timeslot = $3;',
<<<<<<< HEAD
    addTimeslot: 'INSERT INTO Timeslot (branch_id, dateslot, timeslot, numSlots) values ($1, $2, $3, $4);',
=======
>>>>>>> 695cd6a42a63c4d9d5db74125ac699aa595358ee
};

module.exports = sqlQueries;
