import notFoundImg from "/404.png";

export default function NotFound() {
  return (
    <div className="w-full h-3/4 flex flex-col justify-center items-center">
      <img className="w-1/4 mx-auto align-middle" src={notFoundImg} />
    </div>
  );
}
