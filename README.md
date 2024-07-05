# Daily Bible Reading Reminder

## Overview

The **Daily Bible Reading Reminder** is a Chrome extension designed to encourage
users to read the Bible daily. It blocks access to non-allowed websites until
the user confirms they have read the Bible or takes a short break.

## Features

- Blocks access to non-allowed websites until the user confirms they have read
  the Bible.
- Allows users to take a 5-minute break.
- Displays a list of recommended Bible reading resources.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the directory where you downloaded/cloned
   this repository.

## Usage

1. When you try to navigate to a non-allowed website, you will be redirected to
   a block page.
2. On the block page, you can either confirm that you have read the Bible or
   take a 5-minute break.
3. After confirming, you will be redirected back to your original URL.

## Files

- `manifest.json`: Defines the extension's permissions, background script, and
  web accessible resources
