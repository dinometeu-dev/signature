const MobileBlocker = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white text-center px-10 min-[1410px]:hidden">
    <p className="text-5xl mb-5">👷</p>
    <p className="font-headings text-4xl font-medium text-gray-title mb-4 leading-snug">
      Hey, come back on desktop!
    </p>
    <p className="font-primary text-black/50 text-base max-w-xs leading-relaxed">
      This experience is crafted for bigger screens. I&apos;m working on a
      mobile version — see you soon!
    </p>
  </div>
);

export default MobileBlocker;
