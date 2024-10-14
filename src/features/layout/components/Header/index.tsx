const Header = () => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-full max-h-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center py-4">
          <img
            src={
              'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/07/24/15884296/d36e559a0a718d050fc2c911fa3d3365_8529512733030822447.png'
            }
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
