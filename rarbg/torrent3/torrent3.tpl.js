const pluginTpl = `
<form>
<hr/>
  <table>
    <tbody>

      <tr>
        <td>
          <button type="button" ndefault-fn>Default</button>
        </td>
        <td>
          <input nautosize type="hidden" name="host" />
          <input nautosize  name="fn" />
          <button type="submit" name="save">save</button>
        </td>
      </tr>

      <tr>
        <td>
           <button type="button" ndefault-url>Default</button>
        </td>
        <td>
          <input nautosize  name="url" />
        </td>
      </tr>

      </tbody>
    </table>
<br/>
</form>`;

const torrentFormTpl = `
    <form id="torrentForm">
    <table class="lista" >
      <tbody>
          <tr>
            <td class="header2">Actions: </td>
            <td>
                <button type="button" ntoggle-btn>toggle</button>
                <button type="submit" name="save">save</button>
            </td>
          </tr>
          <tr ntoggle>
              <td class="header2">title: </td>
              <td class="lista"><input nautosize name="title" /></td>
              <td class="lista"><button  type="button" ndefault-title>default</button></td>
          </tr>
          <tr>
              <td class="header2">name: </td>
              <td class="lista"><input nautosize name="name" /></td>
              <td class="lista"><button  type="button" ndefault-name>default</button></td>
          </tr>
          <tr ntoggle>
              <td class="header2">hash: </td>
              <td class="lista"><input nautosize disabled name="hash" /></td>
              <td class="lista"><button  type="button" ndefault-hash>default</button></td>
          </tr>
          <tr ntoggle>
              <td class="header2">magnet: </td>
              <td class="lista"><input nautosize name="magnet" /></td>
              <td class="lista"><button  type="button" ndefault-magnet>default</button></td>
          </tr>
          <tr ntoggle>
              <td class="header2">poster: </td>
              <td class="lista"><input nautosize name="poster" /></td>
              <td class="lista"><button  type="button" ndefault-poster>default</button></td>          </tr>
          <tr>
              <td class="header2">studio: </td>
              <td class="lista"><input nautosize name="studio"/></td>
              <td class="lista"><button  type="button" ndefault-studio>default</button></td>
          </tr>
          <tr>
              <td class="header2">stars: </td>
              <td class="lista"><input nautosize name="stars"/></td>
              <td class="lista"><button  type="button" ndefault-stars>default</button></td>
          </tr>
          <tr>
              <td class="header2">categories: </td>
              <td class="lista"><input nautosize name="categories" /></td>
              <td class="lista"><button  type="button" ndefault-categories>default</button></td>
          </tr>

      </tbody>
    </table>
    </form>
    <hr/>
    `;

console.log("tpl...");
