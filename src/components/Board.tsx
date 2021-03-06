import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { BoardAtoms, IBoardItem } from "../atoms";
import Button from "./Button";
import Card from "./Card";

interface IForm {
  text: string;
}

interface IProps {
  boardTitle: string;
  index: number;
}

const Container = styled.section`
  width: 270px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 4px;
  padding: 10px;
  height: min-content;
  margin-right: 10px;
`;

const TitleText = styled.h2`
  color: "black";
  padding: 5px;
  font-weight: bold;
  margin-bottom: 6px;
`;

const Btn = styled.button`
  width: 100%;
  padding: 6px 0px;
  border: none;
  background-color: transparent;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.1s ease-in;
  &:hover {
    background: rgba(92, 93, 94, 0.1);
    cursor: pointer;
  }
  color: #636e72;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  resize: none;
  width: 250px;
  border-radius: 4px;
  border: none;
  outline: none;
  padding: 8px;
  height: 54px;
  overflow-wrap: break-word;
  margin-bottom: 10px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
`;

const Ul = styled.ul<{ isDraggingOver: boolean }>`
  min-height: 5px;
  li {
    background-color: #636e72;
    border-radius: 4px;
  }
  li.placeholder {
    height: ${(props) => (props.isDraggingOver ? "auto" : 0)};
  }
`;

const CancleBtn = styled.button`
  border: none;
  font-size: 18px;
  margin-left: 6px;
  &:hover {
    cursor: pointer;
  }
`;

// boardTitle: 사용자가 만든 Board의 이름
const Board = ({ boardTitle, index }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const [board, setBoard] = useRecoilState(BoardAtoms);

  const onVaild = ({ text }: IForm) => {
    if (text === "") return;

    // Card로 추가할 데이터
    // 현재 존재하는 Board 중 이름이 boardTitle에 해당하는 배열
    const new_arr = [...board[boardTitle]];
    // console.log(new_arr);
    const id = Date.now().toString();

    // boardTitle에 새로운 Card를 추가
    new_arr.push({ id, text });
    setBoard((prev) => ({ ...prev, [boardTitle]: new_arr }));
    setValue("text", "");
  };

  const MouseDown = ({ target: { nodeName, id } }: any) => {
    if (id === "root" || nodeName === "H2") setIsOpen(false);
  };

  useEffect(() => {
    document.body.addEventListener("mousedown", (e) => MouseDown(e));
    return () => document.body.removeEventListener("mousedown", MouseDown);
  }, []);

  return (
    <Draggable draggableId={boardTitle} index={index} key={boardTitle}>
      {(magic) => (
        <Container ref={magic.innerRef} {...magic.draggableProps}>
          <TitleText {...magic.dragHandleProps}>{boardTitle}</TitleText>
          <Droppable direction="vertical" droppableId={boardTitle} type="card">
            {(p, s) => (
              <Ul
                ref={p.innerRef}
                {...p.droppableProps}
                isDraggingOver={s.isDraggingOver}
              >
                {board[boardTitle].map((data: IBoardItem, index) => (
                  <Card key={index} data={data} index={index} />
                ))}
                <li className="placeholder">{p.placeholder}</li>
              </Ul>
            )}
          </Droppable>
          {isOpen ? (
            <Form onSubmit={handleSubmit(onVaild)}>
              <TextArea placeholder="Enter your Task" {...register("text")} />
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button text="Add" />
                <CancleBtn type="button" onClick={() => setIsOpen(false)}>
                  ✖
                </CancleBtn>
              </div>
            </Form>
          ) : (
            <Btn onClick={() => setIsOpen(true)}>+ Add a card</Btn>
          )}
        </Container>
      )}
    </Draggable>
  );
};

export default React.memo(Board);
