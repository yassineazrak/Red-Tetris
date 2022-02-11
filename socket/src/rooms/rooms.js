class Rooms {
  constructor() {
    if (Rooms.instance instanceof Rooms) {
      return Rooms.instance;
    }
    this.rooms = [
      /**
       * @content
       * @param {string} id - room id
       * @param {string} name - room name
       * @param {boolean} isPrivate - is room private
       * @param {string} status - room status
       * @param {string} admin - room admin
       * @param {array} users - room users
       * @param {array} invit - room invit
       */
    ];
    this.regx = /^[a-zA-Z0-9\s]{3,15}$/;
    Rooms.instance = this;
  }

  getRooms = () => {
    let rooms = this.rooms.filter((room) => room.isPravite === false);
    let res = rooms.map((room) => {
      return (
        (({ id, name, isPravite, admin, status }) => ({ id, name, isPravite, admin, status }))(room)
      )
    });
    return res;
  };

  getRoomUsers = (id) => {
    return new Promise((resolve, reject) => {
      const room = this.rooms.find((room) => room.id === id);
      if (room) {
        let users = room.users.map((user) => {
          return (
            (({ id }) => ({ id }))(user)
          )
        });
        return resolve(users);
      }
      return reject({ message: "Room not found" });
    });
  };

  getRoom = (id) => {
    return new Promise((resolve, reject) => {
      let index = this.rooms.findIndex((room) => room.id === id);
      if (index !== -1)
        return resolve(this.rooms[index]);
      return reject({ message: "Room not found" });
    });
  };

  createRoom = (data, user) => {
    return new Promise((resolve, reject) => {
      let trimName = data.roomName.trim().toLowerCase();
      if (!this.regx.test(trimName)) {
        return reject({ message: "Room name is invalid" });
      }
      let existingRoom = this.rooms.find((room) => room.name === trimName);
      if (existingRoom) {
        if (existingRoom.status !== 'waiting')
          return reject({
            message: "Room is already exists and closed",
          });

        return reject({
          message: "Room is already exists do you want to join",
        });
      }
      let room = {
        id: user.id,
        name: trimName,
        admin: user.id,
        isPravite: data.isPravite,
        status: data.isPravite ? "closed" : "waiting",
        users: [{
          name: user.name,
          id: user.id,
          score: 0,
          rows: 0,
          map: [],
          tetrominos: [],
        }],
        invit: [],
      };
      this.rooms.push(room);
      return resolve(room);
    });
  };

  inviteUser = (data) => {
    return new Promise((resolve, reject) => {
      let index = this.rooms.findIndex((room) => room.id === data.roomId);
      if (index !== -1) {
        let newUser = {
          userId: data.userId,
          userName: data.userName,
          status: 'wating',
        }
        this.rooms[index].invit.push(newUser);
        return resolve(this.rooms[index]);
      }
      return reject({ message: "Room not found" });
    });
  };


  changeStatusInvitation = (data) => {
    return new Promise((resolve, reject) => {
      let roomIndex = this.rooms.findIndex((room) => room.id === data.roomId);
      if (roomIndex === -1) return reject({message: "Room not found"});
      let invitIndex = this.rooms[roomIndex].invit.findIndex(item => item.userId === data.userId);
      if (invitIndex === -1) return reject({message: "Your are not invited in this room"});
      this.rooms[roomIndex].invit[invitIndex].status = data.status;
      if (data.status === "accepted"){
        let user = {
          name : this.rooms[roomIndex].invit[invitIndex].userName,
          id: data.userId,
          score: 0,
          rows: 0,
          map: [],
          tetrominos: [],
        }
        this.rooms[roomIndex].users.push(user);
      }
      resolve(this.rooms[roomIndex]);
    })
  }



  joinRoom = (data) => {
    return new Promise((resolve, reject) => {
      let Index = this.rooms.findIndex((room) => room.id === data.roomId);
      if (Index === -1) reject({ message: "Room not found" });
      console.log(this.rooms[Index]);
      if (this.rooms[Index].status !== "waiting") reject({ message: "Room is closed" });
      if (this.rooms[Index].users.findIndex((user) => user.id === data.userId) !== -1)
        reject({ message: "User is already in room" });
      let newUser = {
        name: data.userName,
        id: data.userId,
        score: 0,
        rows: 0,
        map: [],
        tetrominos: [],
      }
      let isInveted = this.rooms[Index].invit.findIndex(user => user.userId === data.userId);
      if (isInveted !== -1)
        this.rooms[Index].invit[isInveted].status = "accepted";
      console.log('isInveted', isInveted, '=>', this.rooms[Index].invit);
      this.rooms[Index].users.push(newUser);
      return resolve(this.rooms[Index]);
    });
  };

  changeStatusRoom = (data) => {
    return new Promise((resolve, reject) => {
      console.log(data);
      let roomIndex = this.rooms.findIndex((room) => room.id === data.roomId);
      if (roomIndex === -1) return reject({ message: "Room not found" });
      if (this.rooms[roomIndex].admin !== data.userId)
        return reject({ message: "You are not admin" });
      this.rooms[roomIndex].status = data.status;
      return resolve(this.rooms[roomIndex]);
    });
  };

  leaveRoom = (userId, roomId) => {
    return new Promise((resolve, reject) => {
      let roomIndex = this.rooms.findIndex((room) => room.id === roomId);
      if (roomIndex === -1) return reject({ message: "Room not found" });
      let userIndex = this.rooms[roomIndex].users.findIndex((user) => user.id === userId);
      if (userIndex === -1) return reject({ message: "User is not joined" });
      this.rooms[roomIndex].users.splice(userIndex, 1);
      return resolve(this.rooms[roomIndex]);
    });
  };

  switchAdmin = (roomId) => {
    let roomIndex = this.rooms.findIndex((room) => room.id === roomId);
    this.rooms[roomIndex].admin = this.rooms[roomIndex].users[0].id;
    return this.rooms[roomIndex];
  }

  deleteRoom = (id) => {
    return new Promise((resolve, reject) => {
      let roomIndex = this.rooms.findIndex((room) => room.id === id);
      if (roomIndex === -1) return reject({ message: "Room not found" });
      this.rooms.splice(roomIndex, 1);
      return resolve(this.getRooms());
    });
  };
}

module.exports = Rooms;
