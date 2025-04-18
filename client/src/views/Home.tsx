export default function Home() {
  return (
    <>
      <div className="flex flex-col h-full">
        <section>
          <h3 className="page-title text-default">Home</h3>
          <div className="flex justify-end items-center gap-3.5">
            <img src="/python-logo.jpg" alt="foto perfil" className="w-12 h-12 rounded-full object-cover text-default"/>
            <p className="text-default">Balbino M.</p>
          </div>
          <h1 className="text-4xl mb-12 text-default">Hello, Balbino!</h1>
        </section>
        <div className="grid grid-cols-4 gap-6 h-full flex-1">
          <div className="col-span-3 grid grid-cols-3 gap-6">
            <button className="bg-secundary text-white rounded-2xl text-3xl font-bold">ADD STUDENT</button>
            <button className="bg-secundary text-white rounded-2xl text-3xl font-bold">EDIT STUDENT</button>
            <button className="bg-secundary text-white rounded-2xl text-3xl font-bold">REMOVE STUDENT</button>

            <button className="bg-secundary text-white rounded-2xl text-3xl font-bold">CREATE PROJECT</button>
            <button className="bg-secundary text-white rounded-2xl text-3xl font-bold">EDIT PROJECT</button>
            <button className="bg-secundary text-white rounded-2xl text-3xl font-bold">REMOVE PROJECT</button>

            <button className="bg-secundary text-white rounded-2xl text-3xl font-bold">CREATE CLASS</button>
            <button className="bg-secundary text-white rounded-2xl text-3xl font-bold">EDIT CLASS</button>
            <button className="bg-secundary text-white rounded-2xl text-3xl font-bold">REMOVE CLASS</button>
          </div>
          <button className="bg-tertiary text-white rounded-2xl text-3xl font-bold">LOG OUT</button>
        </div>
      </div>
    </>
  )
}
