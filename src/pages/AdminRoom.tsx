
import { useHistory, useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import deleteImg from '../assets/images/delete.svg';
//import { useAuth } from "../hooks/useAuth";

import "../styles/room.scss";
import { useRoom } from "./../hooks/useRoom";
import { database } from "../services/firebase";

type RoomsParams = {
  id: string;
};

export function AdminRoom() {
  //const { user } = useAuth();
  const params = useParams<RoomsParams>();
  const history = useHistory();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

    async function handleDeleteQuestion(questionId : string){
        if(window.confirm('Tem certeza que você deseja excluir esta pergunta ?')){
         await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }
  

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutLined onClick={handleEndRoom}>Encerrar Sessão</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                      type="button"
                      onClick={() => {
                        handleDeleteQuestion(question.id)
                      }}

                >
                  <img src={deleteImg} alt="Delete" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
