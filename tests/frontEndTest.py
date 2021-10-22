from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import unittest


class test(unittest.TestCase):
    def setUp(self):
        
        self.browser = webdriver.Firefox(executable_path="tests/geckodriver")

    def test1(self):
        self.browser.get("localhost:3007")
        username = self.browser.find_element_by_name("username")
        password = self.browser.find_element_by_name("password")

        username.send_keys("bob")
        password.send_keys("qwerty")

        time.sleep(10)








if __name__ == "__main__":
    unittest.main(warnings='ignore')
    