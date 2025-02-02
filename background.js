function lectioExtract() {
  try {
    const results = []

    const titles = Array.from(document.querySelector("#s_m_Content_Content_ExerciseGV > tbody > tr:first-child").querySelectorAll("th:not(.OnlyMobile)")).map(el => el.textContent)

    const rows = Array.from(document.querySelectorAll("#s_m_Content_Content_ExerciseGV > tbody > tr:not(:first-child)"))

    for (const row of rows) {
      const result = {}
      const columns = Array.from(row.querySelectorAll("td:not(.OnlyMobile)"))
      for (let i = 0; i < columns.length; i++) {
        result[titles[i]] = columns[i].textContent
      }

      results.push(result)
    }

    return results

  }
  catch (e) {
    console.log(e)
  }
}

browser.action.onClicked.addListener(async (tab) => {
  try {
    console.log("Initiated")
    const results = (await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: lectioExtract
    }))[0].result

    console.log(results)

    url = URL.createObjectURL(new Blob([JSON.stringify(results)]), { type: 'application/json' })

    date = new Date()

    browser.downloads.download({
      url: url,
      filename: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_lectio-afleveringer.json`,
      conflictAction: "uniquify",
    });
  } catch (e) {
  }
});
