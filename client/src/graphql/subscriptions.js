import gql from "graphql-tag";

export const notificationSubscription = gql`
	subscription trackNotification($userId: Int!) {
		trackNotification(userId: $userId) {
			senderId
			senderName
			type
			seen
			createdAt
		}	
	}`

export const chatSubscription = gql `
	subscription newMessage($userId: Int!) { 
		newMessage(userId: $userId) {
	    content
	    receiverId
	    senderId
	    timestamp
	    seen
	    meta
	    conversationName
  }
}`

export const userInfoChangeSubscription = gql`
	subscription userInfoChange($userId: Int!) {
		userInfoChange(userId: $userId) {
			likeInfo
			sender
			onlineInfo
		}	
	}`


export const newConversationSubscription = gql`
	subscription newConversation($userId: Int!) {
		newConversation(userId: $userId) {
			content
			receiverId
			senderId
			timestamp
			meta
			conversationName
			picture
		}	
	}`