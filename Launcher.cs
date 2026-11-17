using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace FlynnFlagExplorer
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string htmlPath = Path.Combine(baseDir, "index.html");

            if (!File.Exists(htmlPath))
            {
                MessageBox.Show(
                    "Could not find index.html in:\n" + baseDir,
                    "Flynn's Flag Morph & Size Explorer",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
                return;
            }

            string fileUri = new Uri(htmlPath).AbsoluteUri;

            // Try Microsoft Edge or Chrome in standalone desktop --app window mode first
            string[] candidateBrowsers = new string[]
            {
                @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                @"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
                @"C:\Program Files\Google\Chrome\Application\chrome.exe",
                @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
            };

            foreach (string browserPath in candidateBrowsers)
            {
                if (File.Exists(browserPath))
                {
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = browserPath,
                        Arguments = string.Format("--app=\"{0}\" --window-size=1360,880", fileUri),
                        UseShellExecute = false
                    };
                    Process.Start(psi);
                    return;
                }
            }

            // Fallback: open with system default handler
            Process.Start(new ProcessStartInfo(htmlPath) { UseShellExecute = true });
        }
    }
}
