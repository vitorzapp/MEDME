import "./index.scss";
import "../../Common/common.scss";
import Cabecalho from "../../Components/Header/index.js";
import icon from "../../../assets/images/user-icon.svg";
import SendVector from "../../../assets/images/send-message-icon.svg";
import storage from "local-storage";
import { listConversation, getConversationInfoByIdDoctor } from "../../../api/conversationApi.js";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { searchImage } from "../../../api/medicApi";

const socket = io.connect("http://192.168.3.15:3051");

export default function Index() {
	const el = document.getElementById("chat-feed");
	const [message, setMessage] = useState("");
	const doctor = storage("doctorInfo");
	const [messages, setMessages] = useState([]);
	const [conversation, setConversation] = useState([]);
	const [conversationId, setConversationId] = useState(-1);
	const [userInfo, setUserInfo] = useState([]);
	const navigate = useNavigate();
	if (!storage("doctorInfo")) {
		navigate("/medic/login");
	}

	async function listDoctorConversation() {
		const r = await listConversation(doctor.id, null);
		setConversation(r);
	}

	async function searchById(id) {
		const r = await getConversationInfoByIdDoctor(id);
		setUserInfo(r);
	}

	async function submitMessage(event) {
		if (event.key == "Enter" || event == "Enter") {
			if (message.trim()) {
				socket.emit("send_message", {
					conversationId: conversationId,
					type: 2,
					senderId: doctor.id,
					message: message,
				});
				el.scrollTop = el.scrollHeight;
				socket.emit("receive_message", {
					conversationId: conversationId,
				});
				setMessage("");
			}
		}
	}

	function messageSide(type) {
		if (type == 2) {
			return "msg-right";
		} else {
			return "msg-left";
		}
	}

	socket.emit("receive_message", {
		conversationId: storage("conversationId"),
	});
	socket.on("receive_message", (data) => {
		setMessages(data);
	});

	useEffect(() => {
		storage("conversationId", "");
		listDoctorConversation();
	}, []);
	useEffect(() => {
		if (el) {
			const bottom = el.scrollHeight;
		el.scrollTop = bottom;
		}
	}, [messages.length]);

	return (
		<main className="messages-main">
			<Cabecalho />
			<div className="messages-content">
				<div className="content">
					<div className="div-conversation">
						{conversation.map((item) => (
							<div
								className="conversation-column"
								onClick={() => {
									setConversationId(item.conversationId);
									searchById(item.conversationId);
									storage("conversationId", item.conversationId);
									socket.emit("receive_message", {
										conversationId: item.conversationId,
									});
								}}>
								<div className="icon-div">
									{item.icon ? (
										<img src={searchImage(item.icon)} alt="icon" width="70%" style={{ borderRadius: "99px" }} />
									) : (
										<img src={icon} alt="icon" width="70%" style={{ borderRadius: "99px" }} />
									)}
								</div>
								<div className="conversation-info">
									<h1 className="name">{item.userName} </h1>
								</div>
							</div>
						))}
					</div>
					<div className="div-message">
						<div className="message-header">
							<div className="div-message-header-icon">
								{userInfo.map((item) =>
									item.icon ? (
										<img src={searchImage(item.icon)} alt="icon" width="70%" style={{ borderRadius: "99px" }} />
									) : (
										<img src={icon} alt="icon" width="70%" style={{ borderRadius: "99px" }} />
									)
								)}
							</div>
							<div className="div-message-header-name">
								{userInfo.map((item) => (
									<span>{item.userName}</span>
								))}
							</div>
						</div>
						<div className="messages-div" id="chat-feed">
							{messages &&
								messages.map((item) => {
									return (
										<div className={messageSide(item.senderType)}>
											<div className="message-box">
												<span className="message-text">{item.message}</span>{" "}
											</div>
										</div>
									);
								})}
						</div>
						{conversationId != -1 && (
							<div className="div-input-send-message">
								<div className="send-message">
									<div className="div-send-message">
										<input
											type="text"
											className="send-message-input"
											value={message}
											placeholder="Digite uma mensagem"
											onChange={(e) => setMessage(e.target.value)}
											onKeyDown={submitMessage}
										/>
										{message && message.trim() && (
											<div className="send-icon-div" onClick={() => submitMessage("Enter")}>
												<img src={SendVector} alt="send-icon" className="send-icon-vector" />
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
