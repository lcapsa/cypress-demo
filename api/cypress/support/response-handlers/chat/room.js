export default class ChatDetailsResponse {
  verifyChatRoomDetails(response, roomID, isModerated) {
    expect(response.body.crID).to.eq(roomID.toString());
    expect(response.body.crIsModerated).to.eq(isModerated.toString());
  }
}
