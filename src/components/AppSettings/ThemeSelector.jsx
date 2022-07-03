export default function ThemeSelector({themeFunction}){
    const handleDarkTheme = (e)=>{
        let theme = parseInt(e.target.value);
        console.log(typeof theme)
        switch (theme) {
          case 1:
            themeFunction("ligth");
            localStorage.setItem('theme', "ligth");
          break;
          case 2:
            themeFunction("dark");
            localStorage.setItem('theme', "dark");
          break;
          default:
            if(window.matchMedia('(prefers-color-scheme: dark)').matches){
                themeFunction("dark");  
            }
            else{
                themeFunction("ligth");
            }
            localStorage.removeItem('theme');
            console.log(localStorage.getItem("theme"))
          break;
        }
    }

    return(
        <>
        <div className="flex flex-row w-full dark:text-white items-center gap-x-2 py-3 justify-evenly content-center">
            <div className="flex-1 text-center w-1/2">
              <label htmlFor="theme" className="cursor-pointer block font-bold">Theme</label>
              <small className="text-sm dark:text-white/70">Change the theme of the application, It is also automatically set by the settings of your device.</small>
            </div>
            <div className="flex-1 w-1/2">
              <select id="theme" className="w-full dark:bg-neutral-900 dark:text-white p-1 bg-white text-center" onChange={handleDarkTheme} defaultValue={localStorage.getItem("theme")?(localStorage.getItem("theme")==="dark"?2:1):3}  >
                  <option value="1">Light</option>
                  <option value="2">Dark</option>
                  <option value="3">System Theme</option>
              </select>
            </div>
        </div>
        </>
    );
}