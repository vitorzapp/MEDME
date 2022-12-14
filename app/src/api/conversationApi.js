import { api } from './configs.js';

export async function listConversation(doctorId, userId) {
    let call = `/conversation?doctorId=${doctorId}&userId=${userId}`
    if (!doctorId || doctorId == undefined) {
        call = `/conversation?doctorId=&userId=${userId}`
    }
    else if (!userId || userId == undefined) {
        call = `/conversation?doctorId=${doctorId}&userId=`
    }
    const r = await api.get(call)
    return r.data;
}
export async function addConversa(doctorId, userId) {
    const r = await api.post(`/conversation?doctorId=${doctorId}&userId=${userId}`)
    return r.data;
  }

export async function getConversationInfoById(conversationId) {
    const r = await api.get(`/conversation/search?id=${Number(conversationId)}`);
    return r.data;
}
export async function getConversationInfoByIdDoctor(conversationId) {
    const r = await api.get(`/conversation/doctor/search?id=${Number(conversationId)}`);
    return r.data;
}

export async function joinConversation(userId, doctorId){
    const r = await api.post(`/conversation`, {
        userId: userId,
        doctorId: doctorId,
    });
    return r.data
}