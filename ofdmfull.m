clear all;
close all;

%% CREATE SYMBOL

M = 2^8;                                                        %number of packets
N = 128;                                                        %number of simbols for packet
r = randi( 16, 1, M*N )-1;                                      %values for all the signals
X = qammod( r, 16, 'UnitAveragePower', true);                   %create all the simbols 

%% OFDM TRANSMITTER
X_matrix = reshape( X, [], 128)';                               %create the packets (every column)
X_matrix = ifft( X_matrix);                                     %inverse fourier trasform
X_traspose= X_matrix';
X_complete = [ X_traspose( :, (128-21) : end), X_traspose]';    % add CP
r1 = sqrt(128)*reshape(X_complete', 1,[]);                      % P/S converter

%% OFDM CHANNEL
ch = channel(22);                                               % create the channel
signal1 = filter(ch,1,r1);                                      % passing on the channel

%% OFDM RECEIVER
signal1 = reshape(signal1, [],150);                             % S/P converter
Y_traspose = signal1(:,23:end);                                 % delete cp
Y_matrix = Y_traspose';                                         
Y2 = fft(Y_matrix)./sqrt(128);                                  % fourie trasform of message
ch1 = fft(ch,128);                                              % fourie trasform of the channel
Y3=Y2'./ch1;                                                    % find the original X
Y3= reshape(Y3,1,[]);                                           % P/S converter
z = qamdemod(Y3,16,'UnitAveragePower',true);
[numErrors,ser] = symerr(X,z);

% function ch=channel()
% alpha = (1-exp(-1/3))/(1-exp(-22/3));
% v = (0:21);
% var = alpha*exp(-v/3);
% real = normrnd(0,(var/2).^0.5,[1,22]);
% im = normrnd(0,(var/2).^0.5,[1,22]);
% ch = (real + j*im);
% % power = sum(abs(ch).^2);
% % tot = sum(var);
%  end
function h = channel(ch_length)
% Generates channel with exponentially decaying power profile
h = zeros(1,ch_length);
alpha = (1-exp(-1/3))/(1-exp(-22/3));

for i=1:ch_length
	sigma = alpha * exp(-(i-1)/3);
	h(i) = sqrt(sigma/2)*randn(1,1) + 1i*sqrt(sigma/2)*randn(1,1);
end
h = h ./ sqrt((h * conj(h).'))';
end