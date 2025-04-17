export default function Home() {
  return (
    <>
      <div className="flex flex-col h-full">
        <section>
          <h3 className="text-4xl">Home</h3>
          <div className="flex justify-end items-center gap-3.5">
            <img src="/python-logo.jpg" alt="foto perfil" className="w-12 h-12 rounded-full object-cover"/>
            <p>Balbino M.</p>
          </div>
          <h1 className="text-6xl mb-12">Hello, Balbino!</h1>
        </section>
        <div className="grid grid-cols-4 gap-6 h-full flex-1">
          <div className="col-span-3 grid grid-cols-3 gap-6">
            <button className="bg-secundary text-white font-semibold rounded-2xl">ADD STUDENT</button>
            <button className="bg-secundary text-white font-semibold rounded-2xl">EDIT STUDENT</button>
            <button className="bg-secundary text-white font-semibold rounded-2xl">REMOVE STUDENT</button>

            <button className="bg-secundary text-white font-semibold rounded-2xl">CREATE PROJECT</button>
            <button className="bg-secundary text-white font-semibold rounded-2xl">EDIT PROJECT</button>
            <button className="bg-secundary text-white font-semibold rounded-2xl">REMOVE PROJECT</button>

            <button className="bg-secundary text-white font-semibold rounded-2xl">CREATE CLASS</button>
            <button className="bg-secundary text-white font-semibold rounded-2xl">EDIT CLASS</button>
            <button className="bg-secundary text-white font-semibold rounded-2xl">REMOVE CLASS</button>
          </div>
          <button className="bg-tertiary text-white font-semibold rounded-2xl">LOG OUT</button>
        </div>
      </div>
    </>
  )
}
