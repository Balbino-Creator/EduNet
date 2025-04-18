export default function Login() {
  return (
    <>
      <h3 className="page-title text-default">Login</h3>
      <section className="w-full h-full flex justify-center items-center">
        <form action="#" className="w-[600px] h-[600px] bg-tertiary rounded-2xl p-12 flex flex-col justify-between">
          <div className="flex justify-between">
            <img className="w-52 h-44 rounded-2xl" src="/teacher.jpeg" alt="imagen profesor" tabIndex={0}/>
            <img className="w-52 h-44 rounded-2xl" src="/children.jpg" alt="imagen niño" tabIndex={0}/>
          </div>
          <input className="bg-white w-full h-14 rounded-2xl pl-4 focus:outline-none focus:ring-4 focus:ring-secundary text-default" type="text" placeholder="User"/>
          <input className="bg-white w-full h-14 rounded-2xl pl-4 focus:outline-none focus:ring-4 focus:ring-secundary text-default" type="text" placeholder="Password"/>
          <input className="bg-secundary w-full h-14 rounded-2xl text-white cursor-pointer" type="submit" />
        </form>
      </section>
    </>
  )
}
