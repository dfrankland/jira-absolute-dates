import moment from 'moment';

let format = undefined;

// Function to replace relative time, with absolute time
const replacer = node => {
  const datetime = node.getAttribute('datetime');
  const isJiraAbsoluteTime = node.getAttribute('jira-absolute-time');
  if (datetime === null || isJiraAbsoluteTime !== null) return;
  const date = document.createElement('time');
  date.setAttribute('jira-absolute-time', '');
  date.innerText = moment(datetime).format(format);
  node.parentNode.replaceChild(date, node);
};

const init = () => {
  // Find all times to replace on page load
  [...document.querySelectorAll('time')].forEach(replacer);

  // JIRA is a SPA, so listen to mutations to the DOM and replace times
  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.querySelectorAll) {
          node.querySelectorAll('time').forEach(replacer);
        }
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
};

window.chrome.storage.sync.get({
  format: '',
}, ({ format: formatSetting }) => {
  if (formatSetting.length > 0) {
    format = formatSetting;
    init();
  }
});
