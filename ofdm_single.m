clear all;
close all;

%% CREATE A CHANNEL WITH UNITARY POWER
power = 0;
for i=1:10000
    power = power + sum(abs(channel().^2));  
end
power = power/10000;

%% CREATE SYMBOL

M = 128;
r = randi([0 15],1,M);
Y = qammod(r,16,'UnitAveragePower',true);
%scatterplot(Y);
y=ifft(Y,128).*sqrt(128);

y = [y(128-21:end), y];
ch = channel();
signal1 = filter(ch,1,y);
SER = [];
for snr = 0:10
%signal1= awgn(signal1,snr);
y = signal1(23:end);
Y2 = fft(y)./sqrt(128);
ch1=fft(ch,128);
Y3=Y2./ch1;
z = qamdemod(Y3,16,'UnitAveragePower',true);
[numErrors,ser] = symerr(r,z);
SER = [ SER ser];
end
snr = 0:1:10;
plot(snr,SER);grid;

function ch= channel()
alpha = (1-exp(-1/3))/(1-exp(-22/3));
v = (0:21);
var = alpha*exp(-v/3);
real = normrnd(0,(var/2).^0.5,[1,22]);
im = normrnd(0,(var/2).^0.5,[1,22]);
ch = (real + j*im);
power = sum(abs(ch).^2);
tot = sum(var);
end
% function h = channel(ch_length)
% % Generates channel with exponentially decaying power profile
% h = zeros(1,ch_length);
% alpha = (1-exp(-1/3))/(1-exp(-22/3));
% 
% for i=1:ch_length
% 	sigma = alpha * exp(-(i-1)/3);
% 	h(i) = sqrt(sigma/2)*randn(1,1) + 1i*sqrt(sigma/2)*randn(1,1);
% end
% h = h ./ sqrt((h * conj(h).'))';
% end