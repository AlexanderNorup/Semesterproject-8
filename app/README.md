the app

## IOS Specific Development

To ensure that your CocoaPods compile and install correctly you need to manually specify the Pods file

```pod
spec.source = { :http => 'https://sourceforge.net/projects/boost/files/boost/1.83.0/boost_1_83_0.tar.bz2',
                  :sha256 => '6478edfe2f3305127cffe8caf73ea0176c53769f4bf1585be237eb30798c3b8e' }

```

`ENABLE_USER_SCRIPT_SANDBOXING = NO`
